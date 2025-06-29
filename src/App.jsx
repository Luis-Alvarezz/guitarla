import { useState, useEffect } from 'react'

import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from './data/db'

function App() {
  // const initialState = ''; // * Nombre comun pero NO recomiendado cuando podemos tener multiples states
  const initialCart = () => {
    // * 1- Recuperar de LocalStorage;
    const localStorageCart = localStorage.getItem('cart');
    // * 2 - Comprobar si hay algo en la variable
    return localStorageCart ? JSON.parse(localStorageCart) : []; // * Si hay algo lo convertimos nuevamente de string a arreglo si no, 
    // * iniciamos en arreglo vacio
  }; 

  // * Creamos nuestro STATE:
  const [data] = useState(db)
  // * Segundo STATE para carrito:
  const [cart, setCart] = useState(initialCart)

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  // * Se sincroniza cada que detecta un cambio en el carrito:
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart)) // * Nombre de lo que queremos almacenar , lo que deseamos almacenar
  }, [cart]) // * ARREGLO DE DEPENDENCIAS (que cambie cuando se ejecute en este caso 'cart')

  function addToCart(item) {
    // console.log('Agregando...');
    // ! Logica para evitar duplicar el registro multiples veces
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id ) // * Callback que seria un Arrow Function, si no existe retorna -1
    console.log(itemExists);
    if (itemExists >= 0) {
      // console.log('Ya existe...');
      // cart[itemExists].quantity++; // * MAL, muta el state
      if (cart[itemExists].quantity >= MAX_ITEMS) 
        return;

      const updatedCart = [...cart] // * Copia del STATE
      updatedCart[itemExists].quantity++; // * Aumentamos cantidad de item en COPIA de STATE
      setCart(updatedCart) // * Actualizamos STATE con COPIA
    } else {
      // console.log('No existe... Agregando...');
      item.quantity = 1; // * Escribo en mi objeto antes de colocarlo en State
      setCart(prevCart => [...prevCart, item]) // * O tambien colocar [...cart, item]
    }

    // saveLocalStorage();
  }

  function removeFromCart(id) {
    // console.log('Eliminando: ', id);
    setCart((prevCart) => prevCart.filter(guitar => guitar.id !== id)); // * Retorname las guitarras diferentes a la que dimos clic 
  }

  function increaseQuantity(id) {
    // console.log('Incrementando...', id);
    const updatedCart = cart.map( (item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item, // * Mantenemos el resto de propiedades (imagen, nombre, precio, etc)
          quantity: item.quantity + 1
        }
      }
      return item; // * Para que los elementos que NO di clic, los mantenga intactos
    })
    setCart(updatedCart) // * Actualizamos STATE con COPIA
  }

  function decreaseQuantity(id) {
    // console.log('Decrementando...', id);
    const updatedCart = cart.map( (item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item;
    })
    setCart(updatedCart) // * Actualizamos STATE con COPIA
  }

  function clearCart() {
    setCart([])
  }

  return (
    <>
      
    <Header
      cart={cart}
      removeFromCart = {removeFromCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      clearCart={clearCart}
    ></Header>
    
    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          { data.map((guitar) => {
            return (
              <Guitar 
                key={guitar.id} // * PROP identificador
                guitar={guitar} // * PROP 2 - Pasar informacion de cada guitarra desde la DB al Componente Guitar.tsx
                setCart = {setCart} // * PROP 3 - Forma 1 y 2 de pasar de agregar elementos al carrito (forma 2 pasando el carrito pero no es consistente para editar o eliminar algun item)
                addToCart = {addToCart} // * PROP 4 - Forma 3: Metodo externo para añadir elementos al carrito
              />
            )
          }) }
        </div>
            
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>

    </>
  )
}


export default App
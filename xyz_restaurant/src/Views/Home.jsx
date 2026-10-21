import React, { useState } from 'react'
import Header from '../Component/Header'
import foodData from "../data/foodData";

const Home = () => {
  const [meals] = useState(foodData)
  return (
    <div>
      <Header title='Cr Menu💖' />
    </div>
  );
}

export default Home
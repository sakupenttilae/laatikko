import React, { useEffect } from 'react';
import { useState } from 'react';
import Scene from './components/Scene';



const App = () => {

  const [title, setTitle] = useState();

  

  const [count, setCount] = useState(0);

  var i = 0;var intervalId = setInterval(function(){   if(i === 10){
    clearInterval(intervalId);
 }  let str = document.title;
    let chars = str.split("");
    let lastChar = chars.pop();
    chars.unshift(lastChar);
    let newStr = chars.join("");
    document.title=newStr.toString();
}, 1000);

  return (
      <div>
        <Scene />
      </div>
  );
};

export default App;

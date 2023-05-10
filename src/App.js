import { useEffect, useState } from "react"



const  App=() => {
  const [value,setValue] =useState('')
  const [message, setMessage] =useState(null);
  const [previousChats,setPreviousChats] =useState([]);
  const [currentTitle,setCurrentTitle] =useState(null);

  const createNewChat=() =>{
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  const handleClick=(uniqueTitle) =>{
      setCurrentTitle(uniqueTitle);
      setMessage(null);
      setValue("");

  }

  const getMessages =async()=>{
    const options ={ 
        method: 'POST',
        headers:{
            'Content-Type' : 'application/json'
        },
        body :JSON.stringify({
            message: value,
           
        })
    }
    try{
      const response =await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    }catch(error)
    {
      console.error(error)
    }
  }
  useEffect(()=>{
    console.log(value,currentTitle,message)
    if(!currentTitle && value && message){
      setCurrentTitle(value);
    }
    if(currentTitle && value && message){
      setPreviousChats( prevChats=> (
        [...prevChats,
          {
            title:currentTitle,
            role:"user",
            content: value,
        },
        {
          title:currentTitle,
          role:message.role,
          content: message.content,
        }
      ]
      ))
    }



  },[message, currentTitle])

  console.log(previousChats);


  const currentChat=previousChats.filter(previousChat =>previousChat.title===currentTitle)
  const uniqueTitles=Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles);


  return (
    <div className='app'>
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
            {uniqueTitles?.map((uniqueTitle,index)=> <li key={index} onClick={() =>handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p> Made by Astha</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1> AsthaGPT</h1>}
          <ul className="feed">
                {currentChat.map((chatMessage,index) => <li key={index}>
                  <p className="role">{chatMessage.role}</p>
                  <p className="">{chatMessage.content}</p>
                </li>)}
          </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={ (e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>➢  </div>
          </div>
          <p className="info">
          Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. 
          <a className="version" href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes" target="_blank" rel="noreferrer">
            ChatGPT May 3 Version.</a>
          </p>

        </div>
      </section>
    </div>
  );
}

export default App;

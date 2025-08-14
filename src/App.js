import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [nameWithPrice, setNameWithPrice] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
  getTransactions().then(setTransactions);
  }, []);

  async function getTransactions(){
  const url = process.env.REACT_APP_API_URL+'/transaction';
  const response = await fetch(url);
  return await response.json();
  }

  function addNewTransaction(ev){
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL+'/transaction';
    // Split input: first word is price, rest is name
    const [price, ...nameParts] = nameWithPrice.trim().split(' ');
    const name = nameParts.join(' ');
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json' },
      body: JSON.stringify({
        price,
        name,
        description,
        datetime
      })
    }).then(response => {
        response.json().then(json => {
          setNameWithPrice('');
          setDescription('');
          setDateTime('');
          console.log('result', json);
        });
    })
  }

  let balance = 0;
  for(const transaction of transactions) {
    balance = balance + transaction.price;
  }

  return (
    <main>
      <h1>$800<span>.00</span></h1>
      <form onSubmit={addNewTransaction}>
  <div className='basics'>
    <input type='text' 
      value={nameWithPrice}
      onChange={ev => setNameWithPrice(ev.target.value)}
      placeholder={'+200 new tv'} />
    <input type="datetime-local"
      value={datetime}
      onChange={ev => setDateTime(ev.target.value)}>
     </input>
  </div>
        <div className='description'>
          <input type='text' 
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}
                    placeholder={'description'}></input>
        </div>
        <button type='submit'>Add new transaction</button>
      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
          <div className='transaction' key={transaction._id || transaction.name+transaction.datetime}>
            <div className='left'>
              <div className='name'>{transaction.name}</div>
              <div className='description'>{transaction.description}</div>
            </div>
            <div className='right'>
              <div className={'price ' + (transaction.price < 0 ? "red":"green")}>{transaction.price}</div>
              <div className='datetime'>{transaction.datetime}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;

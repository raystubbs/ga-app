import './App.css';
import * as api from './api.js'
import { LazyLoader } from './LazyLoader.jsx'
import { useRef } from 'react'
import { marked } from 'marked'

function mdToHtml(md) {
  return marked.parse(
    md,
    {
      mangle: false,
      headerIds: false
    }
  )
}

const cardStyle = {
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  borderRadius: '1rem',
  margin: '0.5rem 1rem 0.5rem 1rem',
  padding: '0.5rem 1rem 0.5rem 1rem',
}
function Item(props) {
  return <section className="item">
    <p dangerouslySetInnerHTML={{__html: mdToHtml(props.body)}}/>
    <address>{props.author}</address><time pubdate="pubdate" dateTime={props.date.toISOString()}>{props.date.toLocaleString()}</time>
  </section>
}

function App() {
  const dataStream = api.fetchAnnouncements()
  const itemRenderer = item => (
    <Item
      author={item.author}
      date={item.date}
      body={item.body}
    />
  )
  const spinnerRenderer = () => (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
      <img src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/90-ring-black-36.svg" alt="Spinner" loop={true}/>
    </div>
  )

  const ref = useRef(null)

  return (
    <LazyLoader
      source={dataStream}
      itemRenderer={itemRenderer}
      spinnerRenderer={spinnerRenderer}
      batchSize={3}
      containerDom={document.getElementById('root')}
    />
  )
}

export default App;

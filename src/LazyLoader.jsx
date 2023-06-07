import { useRef, useState, useEffect, useLayoutEffect, Fragment } from "react"

async function loadBatch(source, n) {
    await new Promise(r => setTimeout(r, 50))

    const batch = []
    for(let i = 0 ; i < n ; i++) {
        const result = await source.next()
        if(result.done) {
            return [batch, true]
        }

        console.info('Fetched item:', result.value)
        batch.push(result.value)
    }
    return [batch, false]
}

function Batch({items, renderer}) {
    return items.map((item, index) => <Fragment key={index}>{renderer(item)}</Fragment>)
}

export function LazyLoader({spinnerRenderer, batchSize, source, itemRenderer, containerDom}) {
    const [loadedBatches, setLoadedBatches] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDone, setIsDone] = useState(false)
    const spinnerRef = useRef(null)

    useEffect(() => {
        if(isLoading) {
            // while filling up, wait for the spinner to be clipped by the
            // parent before telling the component to stop loading new
            // batches
            const observer = new IntersectionObserver(
                ([record], thisObserver) => {
                    if(!record.isIntersecting) {
                        thisObserver.disconnect()
                        setIsLoading(false)
                    }
                },
                {
                    root: containerDom,
                    threshold: 0
                }
            )
    
            observer.observe(spinnerRef.current)
            return () => observer.disconnect()
        } else if(!isDone) {
            // while not filling up (i.e stable), and if we haven't loaded all
            // the items yet; wait for the spinner to become visible before
            // starting to load more items
            const observer = new IntersectionObserver(
                ([record], thisObserver) => {
                    if(record.isIntersecting) {
                        thisObserver.disconnect()
                        setIsLoading(true)
                    }
                },
                {
                    root: containerDom,
                    threshold: 0
                }
            )
    
            observer.observe(spinnerRef.current)
            return () => observer.disconnect()
        }
    })

    // load batches one by one while isLoading is truthy
    useLayoutEffect(() => {
        if(isLoading) {
            loadBatch(source, batchSize)
                .then(([batch, isDone]) => {
                    setLoadedBatches(x => [...x, batch])
                    if(isDone) {
                        setIsLoading(false)
                        setIsDone(true)
                    }
                })
        }
    }, [loadedBatches.length, isLoading, batchSize, source])

    return <>
        {loadedBatches.map((items, index) => (
            <Batch key={index} items={items} renderer={itemRenderer}/>
        ))}
        <div ref={spinnerRef} style={{height: '100%', width: '100%', overflowX: 'scroll'}}>
            {isDone || spinnerRenderer()}
        </div>
    </>
}
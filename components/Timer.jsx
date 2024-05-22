import {useState, useEffect} from 'react';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import LapList from './Laplist';
import {db,auth} from '../firebaseConnection'
import { addDoc, collection, doc, onSnapshot, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';

import './Timer.css'

const Timer = ()=>{
    const [milliseconds, setMilliseconds] = useState(0)
    const [timerOn, setTimerOn] = useState(false)
    const [laps, setLaps]= useState([])
    const [timer, setTimer] = useState([])

    const formatTime = () =>{
        const minutes = ('0'+ Math.floor(milliseconds/60000)%60).slice(-2)
        const seconds = ('0'+ Math.floor(milliseconds/1000)%60).slice(-2)
        const centSeconds = ('0'+ Math.floor(milliseconds/10)%100).slice(-2)
        return `${minutes}:${seconds}:${centSeconds}`;
    }

    const startTimer = (interval) =>{
        return setInterval(() =>{
            setMilliseconds(prevMilliseconds => prevMilliseconds+10)
        },10)
    }
    const stopTimer = (interval) =>{
        clearInterval(interval)
        return interval
    }

    // formatTime();
    async function registerTimer(e){
        e.preventDefault();

        let docRef;

        docRef = await addDoc(collection(db, "tempo"),{
            created: Timestamp.fromDate(new Date()),
            tempo: formatTime()
        })
        .then(()=>{
            console.log("Tempo registrado com sucesso")
        })
        .catch((err) => {
            console.log(err)
        })
        
    }
    const resetTimer= async (e)=> {
        await registerTimer(e)
        setMilliseconds(0)
        setTimerOn(false)
        setLaps([])
    }
    const addLap = ()=>{
        setLaps([...laps,formatTime()])
    }

    useEffect(() =>{
        let interval = null;

        if(timerOn){
            interval = startTimer(interval)
        }else{
            interval = stopTimer(interval)
        }
        return () => stopTimer(interval)
    },[timerOn])

    useEffect(() =>{
        async function loadTimer(){
            const timeRef = collection(db, "tempo")
            const q = query(timeRef, orderBy('created', 'desc'))

            const unsub = onSnapshot(q, (snapshot) =>{
                let lista = [];

                snapshot.forEach((doc) =>{
                    lista.push({
                        id:doc.id,
                        created:doc.data().created.toDate(),
                        tempo: doc.data().tempo
                    })
                    
                    console.log(doc.data().created.toDate())
                    console.log(doc.data().tempo)
                })
                setTimer(lista)
            })
        }
        loadTimer()
    },[])

    return( 
        
    <div className='timer-container'>

        <TimerDisplay time={formatTime()}/>
        <TimerControls 
        timerOn = {timerOn}
        onStart={() => setTimerOn(true)} 
        onStop={() => setTimerOn(false)}
        onReset = { resetTimer} 
        onLap = {addLap}
        />
        <LapList laps={laps}/>

        <div className='timeList'>
        <h3>Histórico</h3>
            {timer.map((item,index) => (
                <div key={item.id} >
                   
                    <div> <span className='item-time'>{item.tempo}</span> - <span className='created-time'>{item.created.toLocaleString()}</span> </div> <br/>

                </div>
                
            ))}
        </div>

    </div>

   
    )
};
export default Timer; 
import React, { useContext, useRef } from 'react'
import { useEffect, useState } from 'react';
import Avatar from './Avatar';
import axios from 'axios';
import { UserContext } from './UserContext';
import Logo from './components/Logo';
import ProfileButton from './components/ProfileButton';
function Chat() {
    const bottomRef = useRef(null);
    const [ws, setWs] = useState()
    const [onlinePeople, setOnlinePeople] = useState({})
    const [onlineAndOfflinePeople, setOnlineAndOfflinePeople] = useState({})
    const [selectedUser, setSelectedUser] = useState(null)
    const [message, setMessage] = useState("")
    const { id, username } = useContext(UserContext)
    const [messages, setMessages] = useState([])
    const [fileName, setFileName] = useState([])
    const [fileUrl, setFileUrl] = useState([])


    useEffect(() => {
        let ws = new WebSocket("ws://localhost:5001");
        setWs(ws);

        const handleConnectionClosed = () => {
            console.log('Connection lost. Attempting to reconnect...');
            setTimeout(() => {
                connect();
            }, 5000);
        };

        const connect = () => {
            ws = new WebSocket("ws://localhost:5001");
            ws.addEventListener('message', handleMessage);
            ws.addEventListener('close', handleConnectionClosed);
            setWs(ws);
        };

        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', handleConnectionClosed);

        return () => {
            ws.removeEventListener('message', handleMessage);
            ws.removeEventListener('close', handleConnectionClosed);
            ws.close();
            clearTimeout();
        };
    }, []);





    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        (async () => {
            await axios.get("/people").then((res) => {
                let tmp_people = {};
                (res.data).forEach(val => {
                    console.log(val)
                    tmp_people[val._id] = val.username
                });
                setOnlineAndOfflinePeople(tmp_people)

            })
        })()
    }, [onlinePeople])

    useEffect(() => {
        (async () => {
            if (selectedUser)
                await axios.get("messages/" + selectedUser).then((res) => {
                    let db_messages = []
                    res.data.forEach(msg => {
                        let tmp = {
                            id: msg?._id,
                            message: msg?.msg,
                            sent: (selectedUser === msg?.receiver?._id),
                            filePath: msg?.filePath
                        };
                        db_messages.push(tmp)
                    })
                    setMessages(db_messages)
                }).catch((e) => {
                    console.log("error2")
                })
        })();
    }, [selectedUser]);

    

    const handleFileUpload = (event) => {
        const fileReader = new FileReader();
        setFileName(event.target.files[0].name)
        fileReader.onload = () => {
            const base64String = fileReader.result.split(',')[1];
            const fileName = event.target.files[0].name;
            axios.post(`/upload/${selectedUser}`, { file: base64String, fileName: fileName })
            .then((response) => {
                console.log("hello")
                setFileUrl(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
            
        };
        
        fileReader.readAsDataURL(event.target.files[0]);
        
    };
    useEffect(()=>{
        sendFile()
    },[fileUrl])
    useEffect(()=>{
        sendFile()
    },[fileName])
    function sendMessage(e) {
        e?.preventDefault();
        ws.send(JSON.stringify({ message, userId: selectedUser}))
        setMessages(messages => [...messages, { message, sent: true }]);
        setMessage("")
    }
    function sendFile() {
        if(!fileName || !fileUrl) return;
        console.log("SEND FILE")
        ws?.send(JSON.stringify({ message: fileName, userId: selectedUser, filePath:fileUrl }))
        setMessages(messages => [...messages, { message:fileName, sent: true,filePath:fileUrl    }]);
        setFileName("");
        setFileUrl("");;
    }
    


    function showPeople(people) {
        let uniquePeople = {}
        people.forEach(({ username, userId }) => {
            uniquePeople[userId] = username
        });
        setOnlinePeople(uniquePeople)
    }

    function handleMessage(e) {
        console.log(e.data)
        const data = JSON.parse(e.data)
        if ("online" in data) {
            showPeople(data.online)
        }
        else {
            console.log(data);
            if (!messages.find((msg) => msg.id === data.id))
                setMessages((messages) => [...messages, { id: data.id, message: data.message, sent: false, filePath: data.filePath }])
        }
    }
    function selectUser(userId) {
        setSelectedUser(userId)
    }
    
    return (

        <div className='flex h-screen'>
            <div className='h-screen w-1/5 flex flex-col'>
                <Logo />
                <div className='overflow-y-auto'>
                    {
                        Object.keys(onlinePeople).map(key => {
                            if (id != key) {
                                return (

                                    <div key={key} onClick={() => {
                                        selectUser(key)
                                        console.log(key)
                                    }}
                                        className={`text-xl  border-b  cursor-pointer`}>
                                        <div className={`flex p-4 m-2 flex-row gap-2 ${(selectedUser === key) ? 'bg-gray-200 border-l-8 ml-2 border-l-blue-400' : ''}`}>
                                            <Avatar userId={key} username={onlinePeople[key]} online={true} />
                                            {onlinePeople[key]}
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                    {
                        Object.keys(onlineAndOfflinePeople).map(key => {
                            if (!(key in onlinePeople)) {
                                return (

                                    <div key={key} onClick={() => {
                                        selectUser(key)
                                        console.log(key)
                                    }}
                                        className={`text-xl  border-b  cursor-pointer`}>
                                        <div className={`flex p-4 m-2 flex-row gap-2 ${(selectedUser === key) ? 'bg-gray-200 border-l-8 ml-2 border-l-blue-400' : ''}`}>
                                            <Avatar userId={key} username={onlineAndOfflinePeople[key]} online={false} />
                                            {onlineAndOfflinePeople[key]}
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
            <div className='h-screen relative bg-gray-200 w-full p-2 flex flex-col '>
                <div className='absolute right-10 top-6'>
                    <ProfileButton username={username} />
                </div>
                <div className='ml-16 flex flex-col flex-grow w-3/5 overflow-y-auto'>
                    {
                        !selectedUser && (
                            <div className='flex items-center justify-center  h-full'>
                                <div className='self-auto text-2xl opacity-30'>
                                    No selected User
                                </div>
                            </div>
                        )
                    }
                    {selectedUser && (
                        messages.map((msg, index) => (
                            <div key={index} className={`rounded-xl m-2 p-2 ${msg.sent ? 'bg-blue-400 self-end' : 'bg-white self-start'} max-w-[400px] `} style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} >

                                {msg.filePath ? (
                                <a className='border-b-2 border-black-500' href={`${axios.defaults.baseURL}/uploads/${msg.filePath}`} target='_blank' download>{msg.message}</a>
                                ) : (
                                msg.message
                                )}

                            </div>


                        ))
                    )}
                    <div ref={bottomRef} />
                </div>
                {
                    selectedUser &&
                    (<form
                        className='flex gap-2 ml-10'
                        onSubmit={sendMessage}
                    >
                        <textarea
                            placeholder={`write your message here... ${message && '\n'}`}

                            onChange={(e) => {
                                setMessage(e.target.value.toString())
                            }}
                            onKeyDown={(e) => {

                                if (e.ctrlKey && e.key === 'Enter') {

                                    sendMessage();
                                }
                            }}
                            className='outline-none rounded-xl w-3/5 p-2 ml-10'
                            value={message}
                        />
                        <label htmlFor="fileInput" className="bg-gray-300 p-1 rounded-xl w-8 h-8 hover:cursor-pointer">
                            <input type="file" id="fileInput" className="hidden" onInput={handleFileUpload} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                        </label>

                        <button type="submit" className='bg-blue-300 p-1 rounded-xl w-8 h-8'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                    )
                }
            </div>
        </div>

    )
}

export default Chat
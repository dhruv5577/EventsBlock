import { Link, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { client, deleteEvent, fetchEvent } from '../../Utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';


export default function EventDetails() {

  const [isDelete,setIsDelete]=useState(false);
  const param=useParams();
  const navigate=useNavigate();

  const {data,isPending,isError,error}=useQuery({
    queryKey:['events',param.id],
    queryFn:({signal})=>fetchEvent({signal,id:param.id})
  })

  const {mutate,isPending:isPendingDeletion,isError:isErrorDeletion,error:errorDeletion}=useMutation({
    mutationFn:deleteEvent,
    onSuccess:()=>{
      client.invalidateQueries({
        queryKey:['events'],
        refetchType:'none'
      })
      navigate('/events')
    }
  })

  function handlestartdelt(){
    setIsDelete(true);
  }

  function handleenddlt(){
    setIsDelete(false);
  }

  function handledelete(){
    mutate({id:param.id});
  }

  let content;

  if(isPending){
    content=(
      <div className='center' id='event-details-content'>
        <p>Fetching Details..</p>
      </div>
    )
  }

  if(isError){
    content=(
      <div className='center' id='event-details-content'>
        <ErrorBlock title='Failed to load events details' message={error.info?.message || 'Faild to fetch data'}/>
      </div>
    )
  }

  if(data){
    const formatdate=new Date(data.date).toLocaleDateString('en-IN',{
      day:'numeric',
      month:'short',
      year:'2-digit'
    })
    content=(
      <>
      {isDelete && (<Modal onClose={handleenddlt}>
        <h2>Are You Sure..??</h2>
        <p>After Deletion You Cannot Undo The Process</p>
        <div className="form-actions">
          {isPendingDeletion && <p>Deleting ,Please Wait ...</p>}
          {!isPendingDeletion && <>
          <button onClick={handleenddlt} className='button-text'>Cancel</button>
          <button onClick={handledelete} className='button'>Delete</button>
          </>
          }
          
        </div>
        {isErrorDeletion && <ErrorBlock title='failed to delete events' message={error.info?.message|| 'Failde to delete events'}/>}
      </Modal>)}
      <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handlestartdelt} >Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
      <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{formatdate} @ {data.time} </time>
            </div>
            <p id="event-details-description"> {data.description} </p>
          </div>
        </div>
        </>  
    )
  }



  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
        
      </article>
    </>
  );
}

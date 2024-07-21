import { Link, redirect, useNavigate, useParams, useSubmit,useNavigation } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useQuery } from '@tanstack/react-query';
import { client, fetchEvent, updateEvent } from '../../Utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const {state}=useNavigation();
  const param=useParams();
  const submit=useSubmit();

  const {data,isError,error}=useQuery({
    queryKey:['events',param.id],
    queryFn:({signal})=>fetchEvent({signal,id:param.id}),
    staleTime:10000
  })


  // const {mutate}=useMutation({
  //   mutationFn:updateEvent,
  //   onMutate:async (data)=>{
  //     const newdata=data.event

  //     await client.cancelQueries({queryKey:['events',param.id]})

  //     const prevdata=client.getQueryData(['events',param.id])

  //     client.setQueryData(['events',param.id],newdata);

  //     return {previousEvent:prevdata}
  //   },
  //   onError:(error,data,context)=>{
  //      client.setQueryData(['events',param.id],content.previousEvent)
  //   },
  //   onSettled:()=>{
  //     client.invalidateQueries(['events',param.id])
  //   }
  // })

  function handleSubmit(formData) {
    submit(formData,{method:'PUT'});
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  

  if(isError){
    content=(
      <>
      <ErrorBlock title='Failed to load events' message={error.info?.message|| 'Failed to load data'}/>
      <div className="form-actions">
        <Link to='../' className='button'>
        Ok!
        </Link>
      </div>
      </>
    )
  }

  if(data){
    content=(
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? (<p>Updating The Data...</p>) : (
          <>
          <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button> </> ) }
        
      </EventForm>
    )
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}

export function loader({params}){
  return client.fetchQuery({
    queryKey:['events',params.id],
    queryFn:({signal})=>fetchEvent({signal,id:params.id})
  })
}

export async function action({request,params}){
  const formdata=await request.formData()
  const updateddata=Object.fromEntries(formdata);
  await updateEvent({id:params.id,event:updateddata});
  await client.invalidateQueries(['events']);
  return redirect('../')
}
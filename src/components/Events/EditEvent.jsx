import { Link, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useQuery,useMutation } from '@tanstack/react-query';
import { client, fetchEvent, updateEvent } from '../../Utils/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const param=useParams();

  const {data,isPending,isError,error}=useQuery({
    queryKey:['events',param.id],
    queryFn:({signal})=>fetchEvent({signal,id:param.id})
  })


  const {mutate}=useMutation({
    mutationFn:updateEvent,
    onMutate:async (data)=>{
      const newdata=data.event

      await client.cancelQueries({queryKey:['events',param.id]})

      const prevdata=client.getQueryData(['events',param.id])

      client.setQueryData(['events',param.id],newdata);

      return {previousEvent:prevdata}
    },
    onError:(error,data,context)=>{
       client.setQueryData(['events',param.id],content.previousEvent)
    },
    onSettled:()=>{
      client.invalidateQueries(['events',param.id])
    }
  })

  function handleSubmit(formData) {
    mutate({id:param.id,event:formData});
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if(isPending){
    content=(
      <div className='center'>
        <LoadingIndicator/>
      </div>
    )
  }

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
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    )
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}

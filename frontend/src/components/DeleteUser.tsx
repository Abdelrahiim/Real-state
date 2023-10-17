import {useState} from "react";
import {Button, Modal, Spinner} from 'flowbite-react';
import {HiOutlineExclamationCircle} from "react-icons/hi";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../app/store.ts";
import {deleteFailure, deleteStart, signingOut, Status} from "../app/features/user/userSlice.ts";
import {deleteProfile} from "../api.ts";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import {AxiosError} from "axios";

const DeleteUser = () => {
  const {currentUser, status, error} = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const signOut = useSignOut()
  const [openModal, setOpenModal] = useState<string | undefined>();
  const props = {openModal, setOpenModal};

  const handleAccountDelete = async () => {
    try {
      dispatch(deleteStart())
      await deleteProfile(currentUser?._id as string)
      signOut()
      // dispatch(deleteSuccess())
      dispatch(signingOut())
    } catch (err: any) {
      const e = err as AxiosError<{ error: string }>
      dispatch(deleteFailure(e?.response?.data.error || e.message));


    }
  }
  return (
    <>
      <span onClick={() => {
        props.setOpenModal('pop-up')
      }} className={"text-red-700 cursor-pointer"}>Delete Account</span>
      <Modal show={props.openModal === 'pop-up'} size="md" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"/>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete Your Account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleAccountDelete} disabled={status === Status.Submitting}>
                {status !== Status.Submitting ? "Yes I am Sure" : <>
                  <Spinner/>
                  Loading..</>}
              </Button>
              <Button color="gray" onClick={() => props.setOpenModal(undefined)}>
                No, cancel
              </Button>
            </div>
          </div>
          {error && <p className='text-red-500 mt-5'>{error}</p>}
        </Modal.Body>

      </Modal>
    </>
  );
};
export default DeleteUser
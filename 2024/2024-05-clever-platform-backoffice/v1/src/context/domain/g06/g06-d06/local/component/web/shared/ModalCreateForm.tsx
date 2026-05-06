import CWButton from '@component/web/cw-button';
import { Modal } from '@component/web/cw-modal';
import { api } from '@domain/g06/g06-d06/local/api';
import API from '@domain/g01/g01-d04/local/api';
import HorizonTextInput from '@domain/g06/g06-d06/local/component/web/atom/HorizonTextInput';
import { useCallback, useEffect, useState } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { get } from 'lodash';
import dayjs from 'dayjs';
import { useParams } from '@tanstack/react-router';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';

interface Props {
  open: boolean;
  onClose(): void;
  onCompleted?(): void;
}
interface FormValues {
  subject_teacher: string;
  head_of_subject: string;
  registrar: string;
  deputy_director: string;
  principal: string;
  document_number_start: string;
  issue_date?: string;
  sign_date?: string;
}

const ModalCreateForm = ({ open, onClose, onCompleted }: Props) => {
  const userData = getUserData();
  const form = useForm<FormValues>({
    defaultValues: {
      subject_teacher: '',
      head_of_subject: '',
      registrar: '',
      deputy_director: '',
      principal: '',
      document_number_start: '',
    },
  });
  const params = useParams({ strict: false });

  const [isFirstForm, setIsFirstForm] = useState<boolean>(true);
  const [isDone, setIsDone] = useState<boolean>(false);

  const handleSubmit = form.handleSubmit(async (values) => {

    if (isFirstForm) {
      setIsFirstForm(false);
      return;
    }
    if (!isDone) {
      const response = await api.student.CreatePhorpor5(String(params.evaluationFormId), {
        deputy_director: get(values, 'deputy_director'),
        document_number_start: get(values, 'document_number_start'),
        head_of_subject: get(values, 'head_of_subject'),
        principal: get(values, 'principal'),
        registrar: get(values, 'registrar'),
        subject_teacher: get(values, 'subject_teacher'),
        issue_date: get(values, 'issue_date', dayjs().format('YYYY-MM-DD HH:mm')),
        sign_date: get(values, 'sign_date', dayjs().format('YYYY-MM-DD HH:mm')),
      });

      if (response.status_code === 200 || response.status_code === 201) {
        setIsDone(true);
        onCompleted && onCompleted();
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        form.setError('document_number_start', {
          message: response.message,
          type: 'required',
        });
      }
    }
  });

  const handleOnClose = useCallback(() => {
    form.reset();
    setIsFirstForm(true);
    setIsDone(false);
    onClose();
  }, [onClose, form]);

  useEffect(() => {
    if (!open) return;

    API.school
      .GetById(userData.school_id)
      .then((res) => {
        form.setValue('head_of_subject', res.academic_affair_head || '');
        form.setValue('deputy_director', res.deputy_director || '');
        form.setValue('principal', res.director || '');
        form.setValue('registrar', res.registrar || '');
      })
      .catch((err) => {
        showMessage('พบปัญหาในการนำเข้าข้อมูลโรงเรียน', 'error');
      });
  }, [open, userData.school_id, form]);
  return (
    <Modal
      className="w-[400px]"
      open={open}
      onClose={handleOnClose}
      disableCancel
      disableOk
      title={
        isFirstForm
          ? 'ระบุชื่อผู้ลงนาม'
          : !isDone
            ? 'ระบุเลขเริ่มต้นเอกสารใบรับรอง'
            : 'ออกรายงานสำเร็จ'
      }
    >
      <div className="flex flex-col gap-4">
        {isDone && (
          <span className="text-sm font-normal">
            การออกรายงาน ปพ.5 และ ปพ.6 ของคุณสำเร็จแล้ว
          </span>
        )}

        {isFirstForm && (
          <>
            <HorizonTextInput
              className="justify-between"
              inputClassName="max-w-44"
              placeholder="ชื่อ นามสกุล"
              label="ครูประจำชั้น/ครูที่ปรึกษา"
              name="subject_teacher"
              control={form.control as unknown as Control<FieldValues>}
              rules={{ required: true }}
            />
            <HorizonTextInput
              className="justify-between"
              inputClassName="max-w-44"
              placeholder="ชื่อ นามสกุล"
              label="หัวหน้างานวิชาการโรงเรียน"
              name="head_of_subject"
              control={form.control as unknown as Control<FieldValues>}
              rules={{ required: true }}
            />
            <HorizonTextInput
              className="justify-between"
              inputClassName="max-w-44"
              placeholder="ชื่อ นามสกุล"
              label="นายทะเบียน"
              name="registrar"
              control={form.control as unknown as Control<FieldValues>}
              rules={{ required: true }}
            />
            <HorizonTextInput
              className="justify-between"
              inputClassName="max-w-44"
              placeholder="ชื่อ นามสกุล"
              label="รองผู้อำนวยการโรงเรียน"
              name="deputy_director"
              control={form.control as unknown as Control<FieldValues>}
              rules={{ required: true }}
            />
            <HorizonTextInput
              className="justify-between"
              inputClassName="max-w-44"
              placeholder="ชื่อ นามสกุล"
              label="ผู้อำนวยการโรงเรียน"
              name="principal"
              control={form.control as unknown as Control<FieldValues>}
              rules={{ required: true }}
            />
          </>
        )}

        {!isFirstForm && !isDone && (
          <HorizonTextInput
            className="block"
            name="document_number_start"
            control={form.control as unknown as Control<FieldValues>}
            rules={{ required: true }}
          />
        )}

        <div className="mt-1 flex w-full gap-3">
          {isDone ? (
            <CWButton className="w-full" title="ปิด" onClick={handleOnClose} />
          ) : (
            <>
              <CWButton outline className="w-full" title="ยกเลิก" onClick={handleOnClose} />
              <CWButton className="w-full" title="ตกลง" onClick={handleSubmit} />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateForm;
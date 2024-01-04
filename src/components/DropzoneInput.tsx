'use client';
import { useState } from 'react';
import { useMerchiFormContext } from './MerchiProductFormProvider';
import { uploadFileToServer } from '../actions/files';
import { Accept, useDropzone } from 'react-dropzone';
import { CgSpinner } from 'react-icons/cg';
import { FaRegImage, FaPlus } from 'react-icons/fa';

interface Props {
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
  onUploadSuccess: (file: any) => void;
  placeholder?: string;
}

function DropzoneInput({
  accept = '.jpg,.jpeg,.gif,.png',
  disabled = false,
  multiple = false,
  onUploadSuccess,
  placeholder = 'Drop files:',
}: Props) {
  const {
    classNameFileUpload,
    classNameFileUploadTextContainer,
    classNameFileUploadIcon,
    classNameFileUploadIconSecond,
    classNameFileUploadIconContainer,
  } = useMerchiFormContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log('Inside the dropzone');

  const handleFileChange = async (acceptedFiles: File[], _: any, __: any) => {
    console.log(' inside dropzone handleChange');
    setError(null);
    for (const file of acceptedFiles) {
      try {
        setLoading(true);

        const response = await uploadFileToServer(file);
        const data = await response.json();
        console.log(data.file, 'did the file download');
        onUploadSuccess(data.file);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    }
  };

  const acceptFiles: Accept = accept as any;
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileChange,
    accept: acceptFiles,
    disabled,
    multiple,
  });

  const spinnerStyleFix = {
    marginLeft: '-12px',
    top: '13px',
  };

  return (
    <>
      <div {...getRootProps()} className={classNameFileUpload}>
        <input {...getInputProps()} disabled={disabled} />
        <div className={classNameFileUploadTextContainer}>
          <div className={classNameFileUploadIconContainer}>
            {loading ? (
              <CgSpinner
                style={spinnerStyleFix}
                className={classNameFileUploadIcon + ' animate_spin'}
                fontSize='1.5rem'
              />
            ) : (
              <FaRegImage
                className={classNameFileUploadIcon}
                fontSize='1.75rem'
              />
            )}
            <FaPlus className={classNameFileUploadIconSecond} />
          </div>
          <div>
            <div>{loading ? 'Uploading...' : placeholder}</div>
            {accept && <div>{accept.replace(/,/g, ', ')}</div>}
          </div>
        </div>
      </div>
      {error && (
        <div className='text-danger'>
          {(error as any).message || 'Error Uploading File.'}
        </div>
      )}
    </>
  );
}

export default DropzoneInput;

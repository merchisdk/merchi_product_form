import { useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { CgSpinner } from 'react-icons/cg';
import { FaRegImage, FaPlus } from 'react-icons/fa';
import { useMerchiFormContext } from './MerchiProductFormProvider'; 

interface Props {
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
  onUploadSuccess: (files: any) => void;
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
    apiUrl,
    classNameFileUpload,
    classNameFileUploadTextContainer,
    classNameFileUploadIcon,
    classNameFileUploadIconSecond,
    classNameFileUploadIconContainer,
  } = useMerchiFormContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (acceptedFiles: File[], _: any, __: any) => {
    setError(null);
    for (const file of acceptedFiles) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('0', file);

        const response = await fetch(`${apiUrl}/public-upload-job-files/`, {
          method: 'POST',
          body: formData
        });

        let data;
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        } else {
          data = await response.json();
          onUploadSuccess(data.file);
        }
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

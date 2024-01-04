'use client';
import { useState } from 'react';
import { isBoolean, isArray } from 'lodash';
import { IconFile } from './icons';
import { allowedFileTypes } from './utils';
import DropzoneInput from './DropzoneInput';
import InputHiddenStatic from './InputHiddenStatic';
import VariationError from './VariationError';
import VariationLabel from './VariationLabel';
import Collapse from './Collapse';
import { useFieldArray } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faCircleNotch,
  faDownload,
  faTimes,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useMerchiFormContext } from './MerchiProductFormProvider';

const LoadingIcon = () => <FontAwesomeIcon icon={faCircleNotch} spin />;

interface PropsFileListItem {
  file: any;
  disabled?: boolean;
  doDelete?: () => void;
  loading?: boolean;
}

function FileListItem({
  file,
  disabled,
  doDelete,
  loading,
}: PropsFileListItem) {
  const {
    classNameFileListItem,
    classNameFileButtonDownload,
    classNameFileButtonDelete,
  } = useMerchiFormContext();
  return (
    <li className={classNameFileListItem}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className='ml-3'>{file.name}</span>
        {!disabled && (
          <div style={{ marginLeft: 'auto' }}>
            <a
              className={classNameFileButtonDownload}
              href={file.downloadUrl}
              download
            >
              <FontAwesomeIcon icon={faDownload} />
            </a>
            {doDelete && (
              <button
                className={classNameFileButtonDelete}
                onClick={doDelete}
                disabled={Boolean(loading)}
              >
                {loading ? (
                  <LoadingIcon />
                ) : (
                  <FontAwesomeIcon icon={faTrashAlt} />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

interface VariationFilesListProps {
  files: Array<any>;
}

function VariationFilesList({ files }: VariationFilesListProps) {
  const { classNameFileListItemContainer} = useMerchiFormContext();
  return (
    <ul className={classNameFileListItemContainer}>
      {files.map((f: any, i: number) => (
        <FileListItem key={`${i}-publicfile`} file={f} />
      ))}
    </ul>
  );
}

function determineBoolean(value: any) {
  return isBoolean(value) ? value : value === 'true' ? true : false;
}

interface VariationFileProps {
  deleteVariationFile: (file: any) => void;
  file: any;
  index: number;
  inputName: string;
}

function VariationFile({
  deleteVariationFile,
  file,
  index,
  inputName,
}: VariationFileProps) {
  const {
    classNameFilePreviewContainer,
    classNameFilePreviewIconWrapper,
  } = useMerchiFormContext();
  return (
    <div
      className={classNameFilePreviewContainer}
      onClick={() => deleteVariationFile(file)}
    >
      <div
        className={classNameFilePreviewIconWrapper}
        onClick={() => deleteVariationFile(file)}
      >
        <FontAwesomeIcon icon={faTimes} className='close-icon' />
      </div>
      <IconFile file={file} />
      <InputHiddenStatic
        name={`${inputName}[${index}].id`}
        rules={{ required: true }}
        value={file.id}
      />
    </div>
  );
}

interface ButtonUploadedFilesProps {
  files: Array<any>;
  isOpen?: boolean;
  onClick: () => void;
}

function ButtonUploadedFiles({
  files,
  isOpen,
  onClick,
}: ButtonUploadedFilesProps) {
  const hasFiles = Array.isArray(files) && files.length > 0;
  const text =
    files.length !== 1 ? `${files.length} files selected` : '1 file selected';
  const icon = isOpen ? faChevronUp : faChevronDown;
  const { classNameFileUploadButton } = useMerchiFormContext();
  return (
    <button
      className={classNameFileUploadButton}
      disabled={files.length === 0}
      onClick={onClick}
    >
      {hasFiles ? text : 'No files selected'}{' '}
      {hasFiles && <FontAwesomeIcon icon={icon} />}
    </button>
  );
}

interface Props {
  disabled?: boolean;
  name: string;
  variation: any;
}

function VariationFileInput({ disabled, name, variation }: Props) {
  const { classNameFileUploadContainer, control } = useMerchiFormContext();
  const inputName = `${name}.variationFiles`;
  const { variationField } = variation;
  const { allowFileMultiple, placeholder, required, showFilePreview } =
    variationField;
  const { append, fields, remove } = useFieldArray({
    control,
    keyName: 'fileId',
    name: inputName,
    rules: { required },
  });
  const hasFiles = isArray(fields) && fields.length;
  const [isOpen, setIsOpen] = useState(Boolean(hasFiles));
  const toggle = () => setIsOpen(!isOpen);
  const _allowFileMultiple = determineBoolean(allowFileMultiple);
  const _showFilePreview = determineBoolean(showFilePreview);
  function handleUploadSuccess(fs: any) {
    console.log('trying to append the file,', fs);
    if (_allowFileMultiple) {
      append(fs);
    } else {
      if (hasFiles) remove(0);
      append(fs[0]);
    }
  }
  return (
    <div className={classNameFileUploadContainer}>
      <VariationLabel
        variationClassName='merchi-embed-form_input-file'
        name={name}
        variation={variation}
      />
      <DropzoneInput
        accept={allowedFileTypes(variationField)}
        disabled={disabled}
        multiple={allowFileMultiple}
        onUploadSuccess={handleUploadSuccess}
        placeholder={placeholder}
      />
      <VariationError name={name} />
      <div className='uploaded-variation-files'>
        {fields.map((file: any, index: number) =>
          _showFilePreview ? (
            <fieldset className='d-inline-block mr-2' key={file.fileId}>
              <VariationFile
                key={`${name}-file-key-${index}`}
                deleteVariationFile={() => remove(index)}
                file={file}
                index={index}
                inputName={inputName}
              />
            </fieldset>
          ) : (
            <InputHiddenStatic
              key={`${name}-file-key-${index}`}
              name={`${inputName}[${index}].id`}
              rules={{ required: true }}
              value={file.id}
            />
          )
        )}
      </div>
      {!_showFilePreview && (
        <>
          <Collapse isOpen={Boolean(isOpen)}>
            <VariationFilesList files={fields} />
          </Collapse>
          <div className='clearfix mb-3'>
            <ButtonUploadedFiles
              files={fields}
              isOpen={isOpen}
              onClick={toggle}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default VariationFileInput;

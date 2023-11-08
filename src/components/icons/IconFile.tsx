'use client';
import { faCircleNotch, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function IconContainer({ className, icon, spin = false }: any) {
  return (
    <span className={className || 'avatar rounded-circle'}>
      <FontAwesomeIcon icon={icon} spin={spin} />
    </span>
  );
}

export function isPdf(file: any) {
  return file.mimetype === 'application/pdf' ||
         file.mimetype === 'application/x-pdf';
}

interface FileIconProps {
  file: any;
}

function IconFile({ file }: FileIconProps) {
  const fileUrl = file ? String(file.viewUrl) : '';

  return file.id ? isPdf(file) ?
    <IconContainer
      className='avatar avatar-md align-middle bg-secondary text-dark shadow'
      icon={faFilePdf}
    />
  :
    <div
      className='avatar avatar-bg avatar-md align-middle'
      style={{ backgroundImage: `url(${fileUrl})`}}
    />
  :
    <IconContainer
      className='avatar avatar-md align-middle text-dark shadow'
      icon={faCircleNotch}
      spin={true}
    />;
}

export default IconFile;

import * as React from 'react';
import { FaFilePdf } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

function IconContainer({ className, icon: Icon, spin = false }: any) {
  if (!Icon) {
    return null;
  }
  return (
    <span className={className || 'avatar rounded-circle'}>
      <Icon className={spin ? 'animate_spin' : ''} />
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
      icon={FaFilePdf}
    />
  :
    <div
      className='avatar avatar-bg avatar-md align-middle'
      style={{ backgroundImage: `url(${fileUrl})`}}
    />
  :
    <IconContainer
      className='avatar avatar-md align-middle text-dark shadow'
      icon={CgSpinner}
      spin={true}
    />;
}

export default IconFile;

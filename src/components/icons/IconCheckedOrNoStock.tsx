'use client';
import * as React from 'react';
import IconChecked from './IconChecked';
import IconNoStock from './IconNoStock';

interface Props {
  isChecked: boolean;
  noStock: boolean;
}

function IconCheckedOrNoStock({ isChecked, noStock }: Props) {
  return noStock ? <IconNoStock /> : isChecked ? <IconChecked /> : <></>;
}

export default IconCheckedOrNoStock;

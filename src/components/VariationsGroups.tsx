import * as React from 'react';
import { isProductSupplierMOD } from './utils';
import { ButtonAddGroup, ButtonRemoveGroup } from './buttons';
import { LabelGroupCost } from './cost';
import GroupInventory from './GroupInventory';
import InputGroupQuantity from './InputGroupQuantity';
import InputHiddenStatic from './InputHiddenStatic';
import Variations from './Variations';
import { useFieldArray } from 'react-hook-form';
import { useMerchiFormContext } from '../context/MerchiProductFormProvider';

interface Props {
  disabled?: boolean;
  name?: string;
  renderBetweenGroups?: (index: number) => React.ReactNode;
}

function VariationsGroups({ disabled, name = 'variationsGroups', renderBetweenGroups }: Props) {
  const {
    classNameGroupsContainer,
    control,
    hideQuantityField,
    hideCalculatedPrice,
    job,
    product,
  } = useMerchiFormContext();
  const { append, fields, remove } = useFieldArray({
    control,
    keyName: 'groupId',
    name,
  });
  const isResellMOD = isProductSupplierMOD(product);
  const groupCount = fields.length;
  return (
    <>
      {fields.map((group: any, index: number) => {
        const count = index + 1;
        const variationGroup = job.variationsGroups[index];
        return (
          <React.Fragment key={group.groupId}>
            <fieldset
              className={classNameGroupsContainer}
              name={`${name}[${index}]`}
            >
              {isResellMOD || hideQuantityField ? (
                <InputHiddenStatic
                  name={`${name}[${index}].quantity`}
                  value={1}
                />
              ) : (
                <InputGroupQuantity
                  count={count}
                  disabled={disabled}
                  name={`${name}[${index}].quantity`}
                />
              )}
              <Variations
                containerClass='merchi-embed-form_product-group-variation-container'
                disabled={disabled}
                name={`${name}[${index}].variations`}
              />
              {product.needsInventory && variationGroup && (
                <GroupInventory group={job.variationsGroups[index]} />
              )}
              <div className='merchi-embed-form_product-group-actions-cost-container'>
                {!hideCalculatedPrice && variationGroup && (
                  <LabelGroupCost group={variationGroup} />
                )}
                <div className='merchi-embed-form_product-group-actions-container'>
                  {groupCount > 1 && (
                    <ButtonRemoveGroup
                      count={count}
                      disabled={disabled}
                      remove={() => remove(index)}
                    />
                  )}
                </div>
              </div>
              {groupCount === count && (
                <ButtonAddGroup addGroup={append} disabled={disabled} />
              )}
            </fieldset>
            {renderBetweenGroups && renderBetweenGroups(index)}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default VariationsGroups;

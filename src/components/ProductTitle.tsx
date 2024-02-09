import { useMerchiFormContext } from './MerchiProductFormProvider';
import { isoCountries } from './utils';
import { IconCountryFlag } from './icons';

function ProductTitle() {
  const {
    classNameProductTitle,
    classNameProductOriginTitle,
    hideCountry,
    hideDomainName,
    product,
  } = useMerchiFormContext();
  const { domain, name } = product;
  const country = domain.country || 'AU';
  const countryName = isoCountries[country];
  return (
    <div>
      <div className={classNameProductOriginTitle}>
        <h5>
          {!hideCountry &&
            <IconCountryFlag
              countryCode={country.toLowerCase()}
              tooltip={`Country of origin ${countryName}`}
            />
          }
          {!hideDomainName && ` ${domain.emailDomain}`}
        </h5>
      </div>
      <div>
        <h1 className={classNameProductTitle}>{name}</h1>
      </div>
    </div>
  );
}

export default ProductTitle;

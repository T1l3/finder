import { Fragment } from "react";
import Address from "../../components/Address";
import Flex from "../../components/Flex";
import {
  isTerraAddress,
  isValidatorAddress,
  TERRA_ADDRESS_REGEX
} from "../../scripts/utility";
import { transformAssets } from "./format";
import s from "./Action.module.scss";

type Prop = {
  action: string;
};

//1321321terra....
//3213434uluna...
const AmountDenomRegExp = /\d+((terra[0-9][a-z0-9]{38})|(u[a-z]{1,4}))/g;

const Action = (prop: Prop) => {
  const { action } = prop;

  const renderArray: JSX.Element[] = action.split(" ").map(string => {
    if (isTerraAddress(string) || isValidatorAddress(string)) {
      return <Address address={string} hideIcon truncate className={s.value} />;
    } else if (!string.match(TERRA_ADDRESS_REGEX) && string.includes(",")) {
      //123213ukrw,13132uusd,31421uluna....
      return (
        <span className={s.value}>
          {string.includes(".")
            ? string /*exchange_rate*/
            : transformAssets(string)}
        </span>
      );
    } else if (string.match(AmountDenomRegExp)) {
      string = string.replace(",", "");
      const amount = string.replace(TERRA_ADDRESS_REGEX, "");
      const address = string.replace(amount, "");

      return (
        <>
          <span className={s.value}>{transformAssets(amount)}</span>
          {address && (
            <Address address={address} hideIcon truncate className={s.value} />
          )}
        </>
      );
    } else {
      return <span className={s.action}>{string}</span>;
    }
  });

  return (
    <Flex className={s.wrapper}>
      {renderArray.map((item, key) => (
        <Fragment key={key}>{item}</Fragment>
      ))}
    </Flex>
  );
};

export default Action;

import { formatNumValue } from "../../business/Utils";

const PositionAnalysis = (props) => {
  //
  let values = props.values;

  return (
    <>
      <div>
        <div className="table-responsive mb-3">
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <b>Max profit</b>
                </td>
                <td>{formatNumValue(values?.maxProfit, "price")}</td>
                <td>
                  <b>Max Loss</b>
                </td>
                <td>{formatNumValue(values?.maxLoss, "price")}</td>
                <td>
                  <b>Risk / Reward</b>
                </td>
                <td>{formatNumValue(values?.riskRewardRatio, "fixed")}</td>
              </tr>
              <tr>
                <td>
                  <b>Breakeven</b>
                </td>
                <td>
                  {Number(values?.breakEvenList[0])
                    ? new Intl.NumberFormat("en-IN").format(
                        values?.breakEvenList[0]
                      )
                    : values?.breakEvenList[0]}
                  {Number(values?.breakEvenList[1])
                    ? " - " +
                      new Intl.NumberFormat("en-IN").format(
                        values?.breakEvenList[1]
                      )
                    : values?.breakEvenList[1]}
                </td>
                <td>
                  <b>Prob. of Profit</b>
                </td>
                <td></td>
                {/* <td>{formatNumValue(values?.probability, "percentage")}</td> */}
                <td>
                  <b>Days Remaining</b>
                </td>
                <td>{values?.daysRemaining}</td>
              </tr>
              <tr>
                <td>
                  <b>Net Credit</b>
                </td>
                <td>{formatNumValue(values?.credit, "price")}</td>
                <td>
                  <b>Net Debit</b>
                </td>
                <td>{formatNumValue(values?.debit, "price")}</td>
                <td>Net Credit/Debit</td>
                <td>{formatNumValue(values?.netCreditDebit, "price")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PositionAnalysis;

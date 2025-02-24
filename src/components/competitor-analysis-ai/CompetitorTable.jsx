
export default function CompetitorTable({ users, heading }) {
    return (
      <div className="competitor-top-table" >
        <div className="competitor-top-table-scroll">
        <table className="competitor-top-table-container" >
          <thead  className="competitor-top-head">
            <tr className="competitor-top-row">
              {heading.map((item, index) => (
                <th className="competitor-top-row-contents" key={index} >
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="competitor-top-body">
            {users.map((user, rowIndex) => (
              <tr className="competitor-top-body-row" key={rowIndex}>
                {heading.map((col, colIndex) => (
                  <td className="competitor-top-body-row-contents" key={colIndex} >
                    {user[col.id]} {/* Access data dynamically based on heading */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    );
  }
  



  
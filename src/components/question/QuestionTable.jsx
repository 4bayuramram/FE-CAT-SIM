export default function QuestionTable({ table }) {
  if (!table) return null;

  return (
    <div className="my-6 flex justify-center">
      <div className="inline-block">
        <table className="border border-slate-300 text-sm w-auto table-auto">
          <thead>
            <tr className="bg-slate-100">
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  className="border p-2 text-center whitespace-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-t">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="border p-2 text-center whitespace-normal break-words max-w-[300px]"
                  >
                    {cell}
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

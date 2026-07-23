import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CourseTable = ({ programs }) => {
  return (
    <div className="card shadow-md rounded-2xl overflow-hidden border border-gray-200">
      <DataTable 
        value={programs} 
        stripedRows 
        paginator 
        rows={6} 
        // rowsPerPageOptions={[5, 10, 20]} 
        tableStyle={{ minWidth: '50rem' }}
        className="p-datatable-sm"
      >
        <Column 
          field="name" 
          header="Programme Name" 
          sortable 
          style={{ width: '35%' }}
          body={(rowData) => <span className="font-bold text-gray-800">{rowData.name}</span>}
        />
        <Column 
          field="description" 
          header="Description" 
          style={{ width: '40%' }}
          body={(rowData) => <span className="text-gray-600 text-sm">{rowData.description}</span>}
        />
        <Column 
          field="focus" 
          header="Key Focus" 
          style={{ width: '25%' }}
          body={(rowData) => (
            <span className="inline-block bg-blue-50 text-uniport-blue px-3 py-1 rounded-full text-xs font-semibold">
              {rowData.focus}
            </span>
          )}
        />
      </DataTable>
    </div>
  );
};

export default CourseTable;

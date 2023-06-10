module.exports = (items) => {
return `
   <!doctype html>
   <html>
      <head>
         <meta charset="utf-8">
         <title>Complaint Report</title>
         <style>
            .invoice-box {
               margin: auto;
               padding: 10px;
               border: 1px solid #eee;
               box-shadow: 0 0 10px rgba(0, 0, 0, .15);
               font-size: 16px;
               line-height: 24px;
               font-family: 'Helvetica Neue', 'Helvetica',
               color: #555;
            }
            .margin-top {
               margin-top: 30px;
            }
            .justify-center {
               text-align: center;
            }
            .invoice-box table {
               width: 100%;
               line-height: inherit;
               text-align: left;
            }
            .invoice-box table td {
               padding: 5px;
               vertical-align: top;
            }
            .invoice-box table tr td:nth-child(2) {
             text-align: center;
            }
            .invoice-box table tr.top table td {
               padding-bottom: 10px;
            }
            .invoice-box table tr.top table td.title {
               font-size: 11px;
               line-height: 20px;
               color: #333;
            }
            .invoice-box table tr.information table td {
               padding-bottom: 20px;
            }
            .invoice-box table tr.heading td {
               background: #eee;
               border-bottom: 1px solid #ddd;
               font-weight: bold;
            }
            .invoice-box table tr.details td {
            padding-bottom: 10px;
            }
            .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
            }
            .invoice-box table tr.item.last td {
            border: 1px;
            }
            .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
            }
            @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
            }
            .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
            }
            }
         </style>
      </head>
      <body>
         <div class="invoice-box">
            <table cellpadding="3" cellspacing="3">
               <tr>
                  <th>Complaint Date</th>
                  <th>Resolved Date</th>
                  <th>Ticket Number</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Comment</th>
               </tr>
               ${items.map(item => 
                  `<tr class="information">
                        <td>${item.complaint_added_date}</td>
                        <td>${item.complaint_resolved_date != null ? item.complaint_resolved_date : "" }</td>
                        <td>${item.ticketNumberSequance}</td>
                        <td>${item.title}</td>
                        <td>${item.description}</td>
                        <td>${item.user.name}</td>
                        <td>${item.location.name}</td>
                        <td>${item.department.name}</td>
                        <td>${item.status}</td>
                        <td>${item.comment != null ? item.comment : "" }</td>
                  </tr> `
               ).join('')}

            </table>
         </div>
      </body>
   </html>
   `;
};
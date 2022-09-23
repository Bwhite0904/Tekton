using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace *****.Models.Requests
{
    public class AdminDataRequest
    {
        [Required]
        [DataType(DataType.Date)]
        public string FromDate { get; set; }
    }
}

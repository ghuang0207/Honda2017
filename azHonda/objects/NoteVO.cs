using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace azHonda.objects
{
    public class NoteVO
    {
        public int NoteId { get; set; }
        public string Note { get; set; }
        public string StateCode { get; set; }
        public string CategoryId { get; set; }
        public string NoteType { get; set; }
    }
}
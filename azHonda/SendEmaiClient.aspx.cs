﻿using azHonda.services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace azHonda
{
    public partial class SendEmaiClient : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            SrvEmail.SendEmail();
        }
    }
}
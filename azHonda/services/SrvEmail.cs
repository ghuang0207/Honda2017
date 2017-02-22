using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Mail;
using SendGrid;
using System.Threading.Tasks;
using System.IO;

namespace azHonda.services
{
    public static class SrvEmail
    {
        public static void SendEmail()
        {
            // Create the email object first, then add the properties.
            var myMessage = new SendGridMessage();

            // Add the message properties.
            myMessage.From = new MailAddress("ghuang@cloud.com");

            // Add multiple addresses to the To field.
            List<String> recipients = new List<String>
            {
                @"George Gmail <george.ch.huang@gmail.com>",
                @"Dawn Gmail <dawnwang@bu.edu>",
                @"George Office <ghuang@choate.com>"
            };

            myMessage.AddTo(recipients);

            myMessage.Subject = "Cloud eMail Testing";

            //Add the HTML and Text bodies
            myMessage.Html = "<div style='color:red'>Hello World</div>";
            //myMessage.Text = "Hello World plain text!";
            

            var username = "azure_f78f2d9b6f8ba54c9e08a5ea05901f17@azure.com";
            var pswd = "@zFoleyEmail2017";

            //var apiKey = "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";  

            using (var attachmentFileStream = new FileStream(@"C:\temp\print.css", FileMode.Open))
            {
                myMessage.AddAttachment(attachmentFileStream, "Print css");
            }

            var credentials = new NetworkCredential(username, pswd);
            // Create an Web transport for sending email.
            var transportWeb = new Web(credentials);

            // Send the email, which returns an awaitable task.
            transportWeb.DeliverAsync(myMessage);
        }

        
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace azHonda.objects
{
    public class TopicVO
    {
        public int TopicId { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public string StateCode { get; set; }
        public string CategoryId { get; set; }
    }

    public class SubjectCompare : IEqualityComparer<TopicVO>
    {
        #region IEqualityComparer<TopicVO> Members
        public bool Equals(TopicVO x, TopicVO y)
        {
            return x.Subject.Equals(y.Subject);
        }

        public int GetHashCode(TopicVO obj)
        {
            return obj.Subject.GetHashCode();
        }
        #endregion
    }
}
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
        public StateVO State { get; set; }
        public CategoryVO Category { get; set; }
        public int OrderNumber { get; set; }
        public bool ctrl_IsEdit { get; set; }
        public bool ctrl_IsExpand { get; set; }
        public string TopicType { get; set; }
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
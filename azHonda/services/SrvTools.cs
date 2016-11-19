using azHonda.objects;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace azHonda.services
{
    public class SrvTools
    {
        /// <summary>
        /// TopicId = -1 for add
        /// </summary>
        /// <param name="topic"></param>
        /// <returns></returns>
        public static int Add_Update_Topic(TopicVO topic)
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("add_update_topic", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@topicId", topic.TopicId);
            cmd.Parameters.AddWithValue("@subject", topic.Subject);
            cmd.Parameters.AddWithValue("@content", topic.Content);
            cmd.Parameters.AddWithValue("@stateCode", topic.StateCode);
            cmd.Parameters.AddWithValue("@categoryId", topic.CategoryId);

            int topicId = 0;
            try
            {
                conn.Open();
                string result = cmd.ExecuteScalar().ToString();
                if (!string.IsNullOrEmpty(result))
                {
                    topicId = Convert.ToInt32(result);
                }
                return topicId;
            }
            catch (Exception ex)
            {
                string debug = ex.Message;
                throw;
            }
            finally
            {
                conn.Close();
            }
        }

        public static List<StateVO> ListAllStates()
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("list_all_states", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            List<StateVO> states = null;

            try
            {
                conn.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    states = new List<StateVO>();
                    while (reader.Read())
                    {
                        states.Add(new StateVO
                        {
                            StateCode = reader["stateCode"].ToString(),
                            State = reader["stateName"].ToString()
                        });
                    }
                }

                return states;

            }
            catch (Exception ex)
            {
                string debug = ex.Message;
                throw;
            }
            finally
            {
                conn.Close();
            }
        }

        /// <summary>
        /// for subject dropdown/typeahead
        /// </summary>
        /// <returns>TopicVO - Subject</returns>
        public static List<TopicVO> ListAllSubjects()
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("list_all_subjects", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            List<TopicVO> subjects = null;

            try
            {
                conn.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    subjects = new List<TopicVO>();
                    while (reader.Read())
                    {
                        subjects.Add(new TopicVO
                        {
                            Subject = reader["subject"].ToString()
                        });
                    }
                }

                return subjects;

            }
            catch (Exception ex)
            {
                string debug = ex.Message;
                throw;
            }
            finally
            {
                conn.Close();
            }
        }

        /// <summary>
        /// for tabs
        /// </summary>
        /// <returns>CategoryVO - CategoryId and Category</returns>
        public static List<CategoryVO> ListAllCategories()
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("list_all_categories", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            List<CategoryVO> categories = null;

            try
            {
                conn.Open();

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.HasRows)
                {
                    categories = new List<CategoryVO>();
                    while (reader.Read())
                    {
                        categories.Add(new CategoryVO
                        {
                            CategoryId = reader["categoryId"].ToString(),
                            Category = reader["name"].ToString()
                        });
                    }
                }

                return categories;

            }
            catch (Exception ex)
            {
                string debug = ex.Message;
                throw;
            }
            finally
            {
                conn.Close();
            }
        }
        
        /// <summary>
        /// 3rd Tab Display: Get all subject - states (List of StateVO)
        /// </summary>
        /// <param name="topicId"></param>
        /// <returns>StateVO</returns>
        public static List<StateVO> GetStates_by_Subject(string subject)
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("get_states_by_subject", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@subject", subject);

            try
            {
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                List<StateVO> states = null;
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        states.Add(new StateVO
                        {
                            StateCode = reader["StateCode"].ToString(),
                            State = reader["StateName"].ToString()
                        });
                    }
                }

                return states;
            }
            catch (Exception ex)
            {
                string debug = ex.Message;
                throw;
            }
            finally
            {
                conn.Close();
            }
        }

        public static Dictionary<string, List<StateVO>> Get_subjectStatesDict(string subject)
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("get_states_by_subject", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@subject", subject);

            try
            {
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                Dictionary<string, List<StateVO>> subjectDict = new Dictionary<string, List<StateVO>>();
                List<TopicVO> topics = null;
                if (reader.HasRows)
                {
                    topics = new List<TopicVO>();
                    while (reader.Read())
                    {
                        topics.Add(new TopicVO
                        {
                            TopicId = Convert.ToInt16(reader["topicId"]),
                            Subject = reader["subject"].ToString(),
                            Content = reader["content"].ToString()
                        });
                    }
                }

                List<TopicVO> uniqueSubjects = topics.Distinct(new SubjectCompare()).ToList();
                foreach (TopicVO uniqueSubject in uniqueSubjects)
                {
                    List<StateVO> states = new List<StateVO>();
                    List<TopicVO> subjectTopics = topics.FindAll(t => t.Subject == uniqueSubject.Subject).ToList();
                    foreach (TopicVO item in subjectTopics)
                    {
                        states.Add(new StateVO()
                        {
                            StateCode = item.StateCode
                        });
                    }
                }

                return subjectDict;
            }
            catch (Exception ex)
            {
                string debug = ex.Message;
                throw;
            }
            finally
            {
                conn.Close();
            }
        }

        /// <summary>
        /// Single Topic Detail: Get Topic by TopicId
        /// </summary>
        /// <param name="topicId"></param>
        /// <returns></returns>
        public static TopicVO GetTopics_by_TopicId(int topicId)
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("get_topic_by_topicId", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@topicId", topicId);

            try
            {
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                TopicVO topic = null;
                if (reader.HasRows)
                {
                    topic = new TopicVO
                    {
                        TopicId = Convert.ToInt16(reader["topicId"]),
                        Subject = reader["subject"].ToString(),
                        Content = reader["content"].ToString()
                    };
                }

                return topic;
            }
            catch (Exception ex)
            {
                string debug = ex.Message;
                throw;
            }
            finally
            {
                conn.Close();
            }
        }

        /// <summary>
        /// State Topic: Get topics by state and category
        /// </summary>
        /// <param name="stateCode"></param>
        /// <returns>list topicVO</returns>
        public static List<TopicVO> GetTopics_by_State(string stateCode, string categoryId)
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("get_topics_by_state", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@stateCode", stateCode);
            cmd.Parameters.AddWithValue("@categoryId", Convert.ToInt16(categoryId));

            try
            {
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                List<TopicVO> topics = null;
                if (reader.HasRows)
                {
                    topics = new List<TopicVO>();
                    while (reader.Read())
                    {
                        topics.Add(new TopicVO
                        {
                            TopicId = Convert.ToInt16(reader["topicId"]),
                            Subject = reader["subject"].ToString(),
                            Content = reader["content"].ToString()
                        });
                    }
                }

                return topics;
            }
            catch (Exception ex)
            {
                string debug = ex.Message;
                throw;
            }
            finally
            {
                conn.Close();
            }
        }
    }
}
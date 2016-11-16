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
        public static List<StateVO> GetAllStates()
        {
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["conn"].ConnectionString);
            SqlCommand cmd = new SqlCommand("get_all_states", conn);
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
        
    }
}
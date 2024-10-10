using WebApplication1.Model;

namespace WebApplication1.Data
{
    public class firstStore
    {
        public static List<firstModel> firstList = new List<firstModel>
            {
                new firstModel{
                    Id = 1,
                    Name = "ABC",
                    Description = "I'm the first person",
                    Path = "Null"
                },

                new firstModel{
                    Id = 2,
                    Name = "DEF",
                    Description = "I'm the Second person",
                    Path = "Null"
                }
            };
    }
}
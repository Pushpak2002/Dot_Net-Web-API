using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Model
{
    public class firstModel
    {
        //[Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int? Id { get; set; }

        public string Name { get; set; }    
        public string Description { get; set; }

        public string Path { get; set; }    

    }

    //public class InsertModel
    //{
      

    //    public string? Name { get; set; }
    //    public string? Description { get; set; }

    //    public string? Path { get; set; }

    //}
}

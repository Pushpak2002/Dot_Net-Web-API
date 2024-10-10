
using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{

    [ApiController]
    [Route("api/firstApi")]
    public class firstController : ControllerBase
    {

        private readonly ApplicationDbContext _db;

        public firstController(ApplicationDbContext db)
        {
            _db = db;
        }


        // Get all Records

        [HttpGet(Name = "GetAllData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<firstModel>> getfirst()
        {
            
            return Ok(_db._firstModel.ToList());
        }



        // Get Records by ID

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]



        public ActionResult<firstModel> GetFirstById(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            var data = _db._firstModel.FirstOrDefault(u => u.Id == id);
            if (data == null)
            {
                return NotFound();
            }

            return data;

        }


        // Add new records 
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public ActionResult<firstModel> AddFirst([FromBody] firstModel _first)
        {

            if (_db._firstModel.FirstOrDefault(u => u.Name.ToLower() == _first.Name.ToLower()) != null)
            {
                ModelState.AddModelError("CustomError", "User Already Exists");
                return BadRequest(ModelState);
            }

            if (_first == null)
            {
                return BadRequest();
            }

            if(_first.Id <= 0)
            {
                return BadRequest();
            }

            //_first.Id = _db._firstModel.OrderByDescending(u => u.Id).FirstOrDefault().Id + 1;

            firstModel f = new()
            {
                Name = _first.Name,
                Description = _first.Description,
                Path = _first.Path
            };

            _db._firstModel.Add(f);
            _db.SaveChanges();
            //return Ok(_firstModel);
            return CreatedAtRoute("GetAllData",_first);
        }


        // Delete Data

        [HttpDelete("{id:int}", Name = "DeleteVillaById")]
        public IActionResult DeleteFirst(int id)
        {
            if (id == 0)
            {
                return BadRequest();
            }

            var data = _db._firstModel.FirstOrDefault(u => u.Id == id);
            if (data == null)
            {
                return NotFound();
            }
            _db._firstModel.Remove(data);
            _db.SaveChanges();
            return NoContent();
        }


        // Update data
        //[HttpPut("{id:int}", Name = "UpdateFirstById")]
        [HttpPut]
        public IActionResult UpdateFist(int id, [FromBody]firstModel _firstModel)
        {
            if (_firstModel == null || id != _firstModel.Id)
            {
                return BadRequest();
            }


            firstModel f = new()
            {
                Id = _firstModel.Id,
                Name = _firstModel.Name,
                Description = _firstModel.Description,
                Path = _firstModel.Path
            };

            _db._firstModel.Update(f);
            _db.SaveChanges();

            return NoContent();


        }


        // Upload File

        [HttpPut("{id:int}", Name = "UploadFile")]
        public IActionResult UploadFile(int id, IFormFile file)
        {
            var data = _db._firstModel.FirstOrDefault(u => u.Id == id);
            if (data == null)
            {
                return BadRequest();
            }

            var path = new UploadController().Upload(file);

            if(data.Path == "")
            {
                data.Path = data.Path + path;
            }
            else
                data.Path = data.Path + "," + path;
           
            _db._firstModel.Update(data);
            _db.SaveChanges();
            return NoContent();


            //return Ok(new UploadController().Upload(file));
        }






    }
}

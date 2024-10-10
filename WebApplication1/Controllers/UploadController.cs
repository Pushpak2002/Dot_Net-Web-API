namespace WebApplication1.Controllers
{
    public class UploadController
    {
        public string Upload(IFormFile file)
        {
            //extension 
            List<string> validExtensions = new List<string>() { ".jpg", ".jpeg", ".gif" };

            string extension = Path.GetExtension(file.FileName);

            if (!validExtensions.Contains(extension))
            {
                return "Extension is not valid";
            }

            //file Size

            long size = file.Length;
            if (size > (5 * 1024 * 1024))
            {
                return "Maximum Size will be 5mb";
            }

            //name Changing
            string fileName = Guid.NewGuid().ToString() + extension;
            string path = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            string newPath = Directory.GetCurrentDirectory() + "Uploads";
            using FileStream stream = new FileStream(Path.Combine(path, fileName), FileMode.Create);
            file.CopyTo(stream);

            //return fileName
            return newPath;
        }
    }
}
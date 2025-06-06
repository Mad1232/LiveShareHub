using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LiveShareHubAPI.Models; //Added these to use Room.cs and SharedFile.cs
using System.IO;
using Microsoft.AspNetCore.Http;

namespace LiveShareHubApi.Controllers{
    [ApiController]
    [Route("api/room")] 
    public class RoomsController : ControllerBase // inheriting API features from ControllerBase
    {
        private readonly OracleDbService oracleDb; //OrcaleDB running via Docker

        // Constructor
        public RoomsController(OracleDbService db) {
            oracleDb = db; 
         }

        // GET api/room/{id}
        [HttpGet("{id}")]
        public ActionResult<Room> getRoom(string id)
        {
            var room = oracleDb.GetRoomById(id);
            if (room == null)
                return NotFound();

            return Ok(room);
        }

        // GET api/room/{id}/files
        [HttpGet("{id}/files")]
        public ActionResult<List<SharedFile>> getFiles(string id) // return list of SharedFiles for the given roomID
        {
            var files = oracleDb.GetFilesByRoomId(id);
            if (files == null || files.Count == 0)
                return NotFound();
            return Ok(files);
        }

        // GET api/room/all
        [HttpGet("all")]
        public ActionResult<List<Room>> getAllRooms(){
            List<Room> myrooms = oracleDb.getAllRooms(); // retireves from OracleDbService.cs
            return Ok(myrooms);
        }

        // POST api/room
        [HttpPost]
        public ActionResult<Room> createRoom() // create a new Room with a unique ID
        {
            var newRoom = new Room(Guid.NewGuid().ToString()); // Guid.NewGuid() creates a unique room ID
            oracleDb.CreateRoom(newRoom);

            return CreatedAtAction(nameof(getRoom), new { id = newRoom.roomID }, newRoom); // return 201 with location header
        }

        // POST api/room/{id}/files
        [HttpPost("{id}/upload")]
        public async Task<IActionResult> uploadFile(string id, IFormFile file) // add (upload) a file to the room with the specified roomID
        {
            var room = oracleDb.GetRoomById(id);
            if(room == null){
                return NotFound("Room not found!");
            }
            if(file == null || file.Length == 0){
                return BadRequest("No file uploaded!");
            }

            //Generate a unique name for the file
            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");

            //Check if directory exists
            if(!Directory.Exists(uploadFolder)){
                Directory.CreateDirectory(uploadFolder);
            }


            var filePath = Path.Combine(uploadFolder, uniqueFileName); //store the file in UploadedFiles folder

            //Save the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {await file.CopyToAsync(stream);}

            //Save Metadata to DB
            var sharedFile = new SharedFile{
                roomId = id,
                originalFileName = file.FileName,
                storedFileName = uniqueFileName,
                uploadedAt = DateTime.Now
            };

            if (oracleDb.FileExistsInRoom(id, sharedFile.storedFileName))
                return BadRequest("A file with the same storedFileName already exists.");

            oracleDb.AddFileToRoom(id, sharedFile);

            return Ok(sharedFile);
        }

        //GET api/room/{roomId}/files/{fileName}
        [HttpGet("{roomId}/files/{fileName}")]
        public IActionResult DownloadFile(string roomId, string fileName){
            var uploadedFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedFiles");
            var filePath = Path.Combine(uploadedFolder , fileName);

            if(!System.IO.File.Exists(filePath)){
                return NotFound("File not found!");
            }

            var contentType = "application/octet-stream";  //convert any file type into binary
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, contentType, fileName);
        }

        // DELETE by roomID api/room/{roomId}
        [HttpDelete("{roomId}")]
        public ActionResult DeleteRoomByID(string roomId)
        {
            var room = oracleDb.GetRoomById(roomId);
            if (room == null)
                return NotFound("Room not found");

            oracleDb.DeleteRoomByID(roomId);
            return Ok("Room deleted successfully");
        }
    }

}
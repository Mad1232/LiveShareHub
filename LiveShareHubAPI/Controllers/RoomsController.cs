using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LiveShareHubAPI.Models; //Added these to use Room.cs and SharedFile.cs

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

        // POST api/room
        [HttpPost]
        public ActionResult<Room> createRoom() // create a new Room with a unique ID
        {
            var newRoom = new Room(Guid.NewGuid().ToString()); // Guid.NewGuid() creates a unique room ID
            oracleDb.CreateRoom(newRoom);

            return CreatedAtAction(nameof(getRoom), new { id = newRoom.roomID }, newRoom); // return 201 with location header
        }

        // POST api/room/{id}/files
        [HttpPost("{id}/files")]
        public ActionResult uploadFile(string id, [FromBody] SharedFile file) // add (upload) a file to the room with the specified roomID
        {
            var room = oracleDb.GetRoomById(id);
            if(room == null){
                return NotFound();
            }

            if (oracleDb.FileExistsInRoom(id, file.storedFileName))
                return BadRequest("A file with the same storedFileName already exists.");

            oracleDb.AddFileToRoom(id, file);

            return Ok();
        }
    }

}
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
        private static readonly Dictionary<string, Room> virtual_rooms = new Dictionary<string, Room>(); // hash table to store roomID -> Room

        // Constructor
        public RoomsController() { }

        // GET api/room/{id}
        [HttpGet("{id}")]
        public ActionResult<Room> getRoom(string id) // return Room object based on the provided id
        {
            if (!virtual_rooms.ContainsKey(id))
                return NotFound();

            return Ok(virtual_rooms[id]);
        }

        // GET api/room/{id}/files
        [HttpGet("{id}/files")]
        public ActionResult<List<SharedFile>> getFiles(string id) // return list of SharedFiles for the given roomID
        {
            if (!virtual_rooms.ContainsKey(id))
                return NotFound();

            return Ok(virtual_rooms[id].Files);
        }

        // POST api/room
        [HttpPost]
        public ActionResult<Room> createRoom() // create a new Room with a unique ID
        {
            var newRoom = new Room(Guid.NewGuid().ToString()); // Guid.NewGuid() creates a unique room ID
            virtual_rooms[newRoom.roomID] = newRoom;

            return CreatedAtAction(nameof(getRoom), new { id = newRoom.roomID }, newRoom); // return 201 with location header
        }

        // POST api/room/{id}/files
        [HttpPost("{id}/files")]
        public ActionResult uploadFile(string id, [FromBody] SharedFile file) // add (upload) a file to the room with the specified roomID
        {
            if (!virtual_rooms.ContainsKey(id))
                return NotFound();

            var room = virtual_rooms[id];

            // check if a file with the same storedFileName already exists in this room
            if (room.Files.Any(f => f.storedFileName == file.storedFileName))
            {
                return BadRequest("A file with the same storedFileName already exists.");
            }

            // add the file to the room
            room.Files.Add(file);

            return Ok(); // return 200 OK
        }
    }

}

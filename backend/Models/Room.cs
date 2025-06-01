using System;
using System.Collections.Generic;

namespace LiveShareHubAPI.Models 
{
    // Room has an roomID, list of Files it holds, createdAt to auto delete rooms after 24 hours.
    public class Room
    {
        public string roomID { get; set; } //getters and setters
        public DateTime createdAt { get; set; }
        public List<SharedFile> Files { get; set; }

        //constructor
        public Room(String id) // Renamed parameter for clarity, matching usage
        {
            this.roomID = id;
            createdAt = DateTime.UtcNow;
            Files = new List<SharedFile>();
        }
    }
}
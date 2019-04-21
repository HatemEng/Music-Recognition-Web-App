using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NYoutubeDL;

namespace Earthlink_Music_App.Controllers
{
    [Route("api/media")]
    [ApiController]
    public class MediaController : ControllerBase
    {

        private YoutubeDL youtubeDl = new YoutubeDL();

        [HttpGet("download")]
        public IActionResult DownloadVideo(string url)
        {
            youtubeDl.CancelDownload();
            var process = new Process();
            process.StartInfo.FileName = "./del.bat";

            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.UseShellExecute = false;
            process.Start();
            process.WaitForExit();

            youtubeDl.Options.FilesystemOptions.Output = "/video.mp4";
   
            youtubeDl.Options.VideoFormatOptions.Format = NYoutubeDL.Helpers.Enums.VideoFormat.mp4;
            youtubeDl.Options.PostProcessingOptions.ExtractAudio = false;

            youtubeDl.VideoUrl = url;
         
            System.Diagnostics.Debug.WriteLine("ok");
    
            youtubeDl.Download();
            youtubeDl.CancelDownload();


          


            return Ok(url);
        }

        [HttpGet("convert")]
        public IActionResult ConvertVideo()
        {

            var process = new Process();
            process.StartInfo.FileName = "./cmd.bat";

            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.UseShellExecute = false;
            process.Start();
            process.WaitForExit();

            byte[] bytes = System.IO.File.ReadAllBytes("./cut.mp3");
            String file = Convert.ToBase64String(bytes);
            return Ok(file);
        }

        [HttpGet("result")]
        public IActionResult ReadResult()
        {
            var process = new Process();
            process.StartInfo.FileName = "./api.bat";

            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.UseShellExecute = false;
            process.Start();
            process.WaitForExit();
            return Ok(System.IO.File.ReadAllLines(@"data.txt"));
        }

    }
}
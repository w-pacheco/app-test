/**
 * PerformanceMonitor.js
 * @description Referrence - https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API
 * @author Wilfredo Pacheco
 */

window.performanceLog = new Array();

export function FileRoster(App){
            
  /** This references the browser to list the files loaded from the global preformanceLog; */
  const result = window.performanceLog
  .filter(entry => {
      return entry.includes('Resource[');
  })
  .map(entry => {
      return entry.split(' - ')[1];
  })
  .map(file => {
      
      const DirectoryString = file.split('/');
      const FileString = DirectoryString.pop();
      const ParentDirectoryString = DirectoryString.pop();
      const FileStringArray = FileString.split('.');
      const Path = file.split('/App/')[1];
      
      /** @return array of files loaded by the browser; */
      return {
          File: FileString,
          Directory: DirectoryString.join('/') + '/',
          Url: file,
          Ext: FileStringArray.pop(),
          FileName: FileStringArray.join('.'),
          Path: Path,
          ParentDirectory: ParentDirectoryString,
          isLibrary: file.includes('Libraries'),
      };
  });

  this.Application = App?.Web ? App.Web.Title : this.name;
  this.FileCount = result.length;
  this.Build = App.Build;
  this.TimeStamp = new Date().toISOString();
  this.List = result;
  this.Url = App.Web ? App.Web.Url : location.href;
  this.ServerRelativeUrl = App.Web ? App.Web.ServerRelativeUrl : location.pathname;
  this.PerformanceLog = window.performanceLog;
  
  this.FilterLibraries = function(){
      return result.filter(file => file.Directory.includes('Libraries'));
  }
  
  this.FilterModules = function(){
      return result.filter(file => !file.Directory.includes('Libraries'));
  }
}

export default function PerformanceMonitor(options){
    
  var TotalLoadTime = 0;
  const log = function(msg){
      if (options.saveToDom) window.performanceLog.push(msg);
      if (options.printToConsole) console.info(msg);
  }

  function calculate_load_times() {

      // Check performance support
      if (performance === undefined) return console.warn("= Calculate Load Times: performance NOT supported");
    
      // Get a list of "resource" performance entries
      var resources = performance.getEntriesByType("resource");
      if (resources === undefined 
      || resources.length <= 0) return log("= Calculate Load Times: there are NO `resource` performance records");
    
      log("= Calculate Load Times");
      for (var i=0; i < resources.length; i++)
      {
        log("== Resource[" + i + "] - " + resources[i].name);

        // Redirect time
        var t = resources[i].redirectEnd - resources[i].redirectStart;
        log("... Redirect time = " + t);
    
        // DNS time
        t = resources[i].domainLookupEnd - resources[i].domainLookupStart;
        log("... DNS lookup time = " + t);
    
        // TCP handshake time
        t = resources[i].connectEnd - resources[i].connectStart;
        log("... TCP time = " + t);
    
        // Secure connection time
        t = (resources[i].secureConnectionStart > 0) ? (resources[i].connectEnd - resources[i].secureConnectionStart) : "0";
        log("... Secure connection time = " + t);
    
        // Response time
        t = resources[i].responseEnd - resources[i].responseStart;
        TotalLoadTime += t
        log("... Response time = " + t);
    
        // Fetch until response end
        t = (resources[i].fetchStart > 0) ? (resources[i].responseEnd - resources[i].fetchStart) : "0";
        log("... Fetch until response end time = " + t);
    
        // Request start until reponse end
        t = (resources[i].requestStart > 0) ? (resources[i].responseEnd - resources[i].requestStart) : "0";
        log("... Request start until response end time = " + t);
    
        // Start until reponse end
        t = (resources[i].startTime > 0) ? (resources[i].responseEnd - resources[i].startTime) : "0";
        log("... Start until response end time = " + t);
      }

      log('== Resource Total Load Time: ' + TotalLoadTime);
  }

  return calculate_load_times();
}
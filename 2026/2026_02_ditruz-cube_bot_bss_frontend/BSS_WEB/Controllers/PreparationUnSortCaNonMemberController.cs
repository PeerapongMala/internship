using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreparationUnSortCaNonMemberController : ControllerBase
    {
        private readonly ILogger<PreparationUnSortCaNonMemberController> _logger;
        private readonly IPreparationUnsortCaNonMemberService _preparationUnsortCaNonMemberService;
       
        public PreparationUnSortCaNonMemberController(ILogger<PreparationUnSortCaNonMemberController> logger,
           IPreparationUnsortCaNonMemberService preparationUnsortCaNonMemberService) 
        {
            _logger = logger;
            _preparationUnsortCaNonMemberService = preparationUnsortCaNonMemberService;  
        }

        [ServiceFilter(typeof(RefreshTokenFilter))]
        [AuthenticationActionFilter]
        [HttpPut("Edit")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit([FromBody] List<EditPreparationUnsortCaNonMemberRequest> requests)
        {
            try
            { 
                var serviceResult = await _preparationUnsortCaNonMemberService.EditPreparationUnsortCaNonMemberAsync(requests);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditPreparationUnfit failed. Items={Count}", requests?.Count ?? 0);

                return BadRequest("EDIT_PREPARATION_UNSORT_CA_NON_MEMBER_FAILED");
            }
        }

        [ServiceFilter(typeof(RefreshTokenFilter))]
        [AuthenticationActionFilter]
        [HttpDelete("Delete")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete([FromBody] List<DeletePreparationUnsortCaNonMemberRequest> requests)
        {
            try
            {
                var serviceResult = await _preparationUnsortCaNonMemberService.DeletePreparationUnsortCaNonMemberAsync(requests);
                return Ok(serviceResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeletePreparationUnfit failed. Items={Count}", requests?.Count ?? 0);

                return BadRequest("DELETE_PREPARATION_UNSORT_CA_NON_MEMBER_FAILED");
            }
        }
    }



}

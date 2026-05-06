namespace BSS_WEB.Services
{
    public class BssAdminJobs
    {
        BssAdminHub _adminHub;

        public BssAdminJobs(BssAdminHub adminHub)
        {
            _adminHub = adminHub;
        }

        public async Task ProcessDatas()
        {
            var status = await RetrieveDatas();
            if (!status)
            {
                // if job fails, stop the further execution
                return;
            }

            status = await CalculateInterest();
            if (!status)
            {
                // if job fails, stop the further execution
                return;
            }

            status = await UpdateDatas();
            if (!status)
            {
                // if job fails, stop the further execution
                return;
            }

            status = await SaveLogs();
            if (!status)
            {
                // if job fails, stop the further execution
                return;
            }

            status = await SendEmails();
            if (!status)
            {
                // if job fails, stop the further execution
                return;
            }
        }

        private async Task<bool> RetrieveDatas()
        {
            var type = "Retrieve";
            var message = "Retrieving data";
            var status = "started";

            await _adminHub.SendJobStatus(type, message, status);

            // add some delay so that it looks like it's processing someting
            int delayInMS = GetRandomDelay();
            Task.Delay(delayInMS).Wait();
            status = "completed";
            if (status == "completed")
                message = $"Retrieved the data. ({delayInMS} milli seconds)";
            else
                message = "Failed to retrieve the data.";

            await _adminHub.SendJobStatus(type, message, status);


            if (status == "completed")
            {

                return true;
            }
            else
            {
                return false;
            }

        }

        private async Task<bool> CalculateInterest()
        {
            var type = "Calculate";
            var message = "Calculating interest";
            var status = "started";

            await _adminHub.SendJobStatus(type, message, status);

            // add some delay so that it looks like it's processing someting
            int delayInMS = GetRandomDelay();
            Task.Delay(delayInMS).Wait();

            status = "completed";
            if (status == "completed")
                message = $"Calculated interest for data. ({delayInMS} milli seconds)";
            else
                message = "Failed to calculate the interest.";

            await _adminHub.SendJobStatus(type, message, status);

            if (status == "completed")
                return true;
            else
                return false;
        }

        private async Task<bool> UpdateDatas()
        {
            var type = "Update";
            var message = "Updating data";
            var status = "started";

            await _adminHub.SendJobStatus(type, message, status);

            // add some delay so that it looks like it's processing something
            int delayInMS = GetRandomDelay();
            Task.Delay(delayInMS).Wait();

            status = "completed";
            if (status == "completed")
                message = $"Updated the data. ({delayInMS} milli seconds)";
            else
                message = "Failed to update the data.";

            await _adminHub.SendJobStatus(type, message, status);

            if (status == "completed")
                return true;
            else
                return false;
        }

        private async Task<bool> SaveLogs()
        {
            var type = "Logs";
            var message = "Saving logs";
            var status = "started";

            await _adminHub.SendJobStatus(type, message, status);

            // add some delay so that it looks like it's processing someting
            int delayInMS = GetRandomDelay();
            Task.Delay(delayInMS).Wait();

            status = "completed";
            if (status == "completed")
                message = $"Saved the logs. ({delayInMS} milli seconds)";
            else
                message = "Failed to save the logs.";

            await _adminHub.SendJobStatus(type, message, status);

            if (status == "completed")
                return true;
            else
                return false;
        }

        private async Task<bool> SendEmails()
        {
            var type = "Emails";
            var message = "Sending emails";
            var status = "started";

            await _adminHub.SendJobStatus(type, message, status);

            // add some delay so that it looks like it's processing someting
            int delayInMS = GetRandomDelay();
            Task.Delay(delayInMS).Wait();

            status = "error";
            if (status == "completed")
                message = $"Emails are sent. ({delayInMS} milli seconds)";
            else
                message = "Failed to send the emails.";

            await _adminHub.SendJobStatus(type, message, status);

            if (status == "completed")
                return true;
            else
                return false;
        }

        private int GetRandomDelay()
        {
            int min = 2000;
            int max = 5000;
            Random random = new Random();
            return random.Next(min, max);
        }
    }
}

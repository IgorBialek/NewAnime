import axios from 'axios';
import { createScheduledFunction } from 'inngest';
import { serve } from 'inngest/next';

const job = async () => {
  let status = "Success";

  axios.get(process.env.BACKGROUND_PROCESSING_API_ENDPOINT!);

  return status;
};

export default serve("NewAnime", [
  createScheduledFunction(
    "Trigger API Background Process",
    "*/15 * * * *",
    job
  ),
]);

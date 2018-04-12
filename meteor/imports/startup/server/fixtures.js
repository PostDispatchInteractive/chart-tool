import { Meteor } from 'meteor/meteor';
import DBStatus from '../../api/DBStatus/DBStatus';
import Charts from '../../api/Charts/Charts';

// if (app_settings.s3.enable) {
//   S3.config = {
//     key: process.env.S3_CHARTTOOL_KEY,
//     secret: process.env.S3_CHARTTOOL_SECRET,
//     bucket: process.env.S3_CHARTTOOL_BUCKET,
//     region: process.env.S3_CHARTTOOL_REGION
//   };
// }

Charts._ensureIndex({
  'slug': 'text',
  'heading': 'text',
  'qualifier': 'text',
  'deck': 'text',
  'source': 'text'
});

Meteor.startup(() => {
  DBStatus.remove({}); // clears database status
});

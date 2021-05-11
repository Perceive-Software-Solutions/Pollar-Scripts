USE db1;

SELECT concat('DROP TABLE IF EXISTS ', table_name, ';')
FROM information_schema.tables
WHERE table_schema = 'db1';

SET FOREIGN_KEY_CHECKS = 0;
-- tables
DROP TABLE IF EXISTS Asset;
DROP TABLE IF EXISTS AssetCollection;
DROP TABLE IF EXISTS AssetMessage;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Chat;
DROP TABLE IF EXISTS ChatMembership;
DROP TABLE IF EXISTS Follow;
DROP TABLE IF EXISTS Notif;
DROP TABLE IF EXISTS NotificationSettings;
DROP TABLE IF EXISTS Poll;
DROP TABLE IF EXISTS PollResponse;
DROP TABLE IF EXISTS Post;
DROP TABLE IF EXISTS PostStat;
DROP TABLE IF EXISTS Rule;
DROP TABLE IF EXISTS Story;
DROP TABLE IF EXISTS Subscription;
DROP TABLE IF EXISTS Topic;
DROP TABLE IF EXISTS Trust;
DROP TABLE IF EXISTS UserBlocking;
DROP TABLE IF EXISTS UserDeactivated;
DROP TABLE IF EXISTS UserDevice;
DROP TABLE IF EXISTS UserPhone;
DROP TABLE IF EXISTS UserEmail;
DROP TABLE IF EXISTS UserInfo;
DROP TABLE IF EXISTS UserMain;
SET FOREIGN_KEY_CHECKS = 1;
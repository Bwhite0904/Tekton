USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[GroupMessages_Select_ByMessageId]    Script Date: 9/23/2022 8:45:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 8/11/2022
-- Description: Selects a group message by Id.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================


ALTER proc [dbo].[GroupMessages_Select_ByMessageId]
										@MessageId int

as

/*
---------------Test Code-------------------
Declare @MessageId int = 8

Execute dbo.GroupMessages_Select_ByMessageId 
										@MessageId
										
---------------Test Code-------------------
*/

Begin


		SELECT gm.Id
			  ,gm.Message
			  ,gm.Subject
			  ,gm.GroupId
			  ,gm.SenderId
			  ,gm.DateSent
			  ,gm.DateModified
			  ,gm.DateCreated
			  ,p.Id
			  ,p.UserId
			  ,p.FirstName as SenderFirstName
			  ,p.LastName as SenderLastName
			  ,p.MI
			  ,p.AvatarUrl as SenderAvatarUrl
		  FROM dbo.GroupMessages AS gm
		  inner join dbo.UserProfiles as p on p.UserId = gm.SenderId
		  WHERE (gm.Id = @MessageId)

End


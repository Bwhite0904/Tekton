USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[GroupMessages_Insert]    Script Date: 9/23/2022 8:44:13 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Brandon White
-- Create date: 8/11/2022
-- Description: Adds a group message.
-- Code Reviewer: Silvio Acevedo

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER proc [dbo].[GroupMessages_Insert]
							@Message nvarchar(1000)
							,@GroupId int
							,@SenderId int
							,@Id int OUTPUT

as

/*

Declare @Id int
		,@Message nvarchar(1000) = 'First Group Message'
		,@GroupId int = 11
		,@SenderId int = 8

Execute dbo.GroupMessages_Insert
								@Message
								,@GroupId
								,@SenderId
								,@Id

Select *
from dbo.GroupMessages

*/

Begin

Declare @DateCreated datetime2(7) = GETUTCDATE()

INSERT INTO [dbo].[GroupMessages]
           ([Message]
           ,[GroupId]
           ,[SenderId]
           ,[DateSent]
           ,[DateCreated])
     VALUES
           (@Message
           ,@GroupId
           ,@SenderId
           ,@DateCreated
           ,@DateCreated)

SET			@Id = SCOPE_IDENTITY()

End

